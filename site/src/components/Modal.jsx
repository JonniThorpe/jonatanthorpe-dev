import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import './Modal.css'

/* Accessible modal dialog: closes on Escape / backdrop click, traps initial
   focus on the close button, restores focus to the opener on unmount, and
   locks body scroll while open. Used for project detail. */
export default function Modal({ title, onClose, children }) {
  const closeRef = useRef(null)
  const openerRef = useRef(null)

  useEffect(() => {
    openerRef.current = document.activeElement
    closeRef.current?.focus()

    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      if (openerRef.current instanceof HTMLElement) openerRef.current.focus()
    }
  }, [onClose])

  return (
    <div className="modal" role="presentation" onClick={onClose}>
      <div
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} className="modal__close" onClick={onClose} aria-label="Close dialog">
          <X size={20} strokeWidth={1.75} />
        </button>
        {children}
      </div>
    </div>
  )
}
