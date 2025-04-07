import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'お問い合わせ | PokerRoom',
  description: 'PokerRoomへのお問い合わせはこちらから',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ContactForm />
    </div>
  )
} 