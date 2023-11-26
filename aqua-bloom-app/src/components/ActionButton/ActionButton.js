import { IconButton } from '@mui/material'

export default function ActionButton({ tooltip, onClick, children, style }) {
  return (
    <IconButton
      tooltip={tooltip}
      onClick={onClick}
      aria-label="edit"
      style={{ padding: 0, ...style }}
    >
      {children}
    </IconButton>
  )
}
