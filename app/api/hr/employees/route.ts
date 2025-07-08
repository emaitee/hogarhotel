import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/mongodb';
import Employee from '@/lib/models/Employee';

export async function GET() {
  await connectDB();

  try {
    const employees = await Employee.find({});
    return NextResponse.json({ success: true, data: employees });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}