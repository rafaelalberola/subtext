interface ReadReceiptProps {
  status: 'sent' | 'delivered' | 'read'
}

export default function ReadReceipt({ status }: ReadReceiptProps) {
  const color = status === 'read' ? '#53BDEB' : '#667781'

  if (status === 'sent') {
    return (
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="inline-block ml-1">
        <path d="M11 1L4.5 8.5L1.5 5.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="inline-block ml-1">
      <path d="M11 1L4.5 8.5L1.5 5.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 1L8 8.5L6.5 7" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
