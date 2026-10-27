import { NextResponse } from 'next/server';
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { dynamoDb } from '@/lib/aws';

const TABLE_NAME = 'NotesTable';

// POST: Save a new note into DynamoDB
export async function POST(req: Request) {
  try {
    const { title, description, imageUrl } = await req.json();

    const newItem = {
      id: uuidv4(),
      title,
      description,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: newItem,
      })
    );

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error) {
    console.error('Error saving to DynamoDB:', error);
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }
}

// GET: Fetch all notes from DynamoDB
export async function GET() {
  try {
    const data = await dynamoDb.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      })
    );

    return NextResponse.json(data.Items || [], { status: 200 });
  } catch (error) {
    console.error('Error fetching from DynamoDB:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}