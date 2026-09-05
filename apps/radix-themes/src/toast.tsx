import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { Toast as RadixToast } from "radix-ui"
import { Card, Text } from "@radix-ui/themes"

type ToastItem = { id: number; title: string }
type ToastContextValue = { show: (title: string) => void }
const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const show = (title: string) =>
    setItems((current) => [...current, { id: Date.now(), title }])
  const value = useMemo(() => ({ show }), [])
  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        {items.map((item) => (
          <RadixToast.Root
            key={item.id}
            defaultOpen
            onOpenChange={(open) =>
              !open &&
              setItems((current) =>
                current.filter((entry) => entry.id !== item.id)
              )
            }
          >
            <Card size="1">
              <RadixToast.Title>
                <Text weight="medium">{item.title}</Text>
              </RadixToast.Title>
            </Card>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="rt-toast-viewport" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const value = useContext(ToastContext)
  if (!value) throw new Error("useToast must be used inside ToastProvider")
  return value
}
