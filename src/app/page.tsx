import { redirect } from 'next/navigation'
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  redirect('/rooms/search')
}
