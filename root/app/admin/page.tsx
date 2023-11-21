"use client";

import Link from "next/link";

export default function Admin() {
  return (
    <div>
      <div>
        <p>you are admin.</p>
        <Link href="/admin/create-appointments">
          click here to go to create
        </Link>
      </div>
    </div>
  );
}
