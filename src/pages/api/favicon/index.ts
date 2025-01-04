import type { APIRoute } from "astro";
import { db } from '../../../db';
import { and, eq } from "drizzle-orm";
import { UserTable } from "@/db/schema/user";
import path from 'path';
import { mkdir } from "fs/promises";
import { OrganizationTable } from "@/db/schema/organization";
import { createWriteStream } from "fs";

export const POST: APIRoute = async({ request }) => { 
    try { 
    const organizationId = request.headers.get('X-Organization-Id');
    const userId = request.headers.get('X-User-Id');
    
    if (!organizationId || !userId) {
      return new Response(JSON.stringify({ error: 'Organization ID and User ID are required' }), {
        status: 400
      });
    }

    const [user] = await db
      .select()
      .from(UserTable)
      .where(
        and(
          eq(UserTable.id, userId),
          eq(UserTable.organizationId, organizationId),
          eq(UserTable.role, 'admin')
        )
    );

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized. Only organization admins can upload favicons.' }), {
        status: 403
      });
    }

    const formData = await request.formData();
    const file = formData.get('favicon') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No favicon file provided' }), {
        status: 400
      });
    }

    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'Invalid file type. Must be an image.' }), {
        status: 400
      });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'favicons');
    await mkdir(uploadsDir, { recursive: true });

    const fileExtension = path.extname(file.name);
    const fileName = `favicon-${organizationId}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);
    const faviconUrl = `/uploads/favicons/${fileName}`;
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const writeStream = createWriteStream(filePath);
    writeStream.write(buffer);
    writeStream.end();

    const [organization] = await db
    .select()
    .from(OrganizationTable)
    .where(eq(OrganizationTable.id, organizationId));

    if (!organization) {
      return new Response(JSON.stringify({ error: 'Organization not found' }), {
        status: 404
      });
    }

    const newSettings = {
      ...organization.settings,
      logo: faviconUrl
    };

    await db
      .update(OrganizationTable)
      .set({
        settings: newSettings
      })
      .where(eq(OrganizationTable.id, organizationId));

    return new Response(JSON.stringify({
      success: true,
      logo: faviconUrl
    }), {
      status: 200
    });
      
    } catch(error) { 
        console.error('Error uploading favicon:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500
        });
    }
}