import { Children, Fragment, type CSSProperties, type ReactNode } from "react"
import { Box, type BoxProps } from "@mui/material"

type Responsive<T> =
  T | Array<T | null> | { xs?: T; sm?: T; md?: T; lg?: T; xl?: T }

type FlexStackProps = Omit<BoxProps, "direction"> & {
  direction?: Responsive<"row" | "row-reverse" | "column" | "column-reverse">
  spacing?: Responsive<number | string>
  alignItems?: Responsive<CSSProperties["alignItems"]>
  justifyContent?: Responsive<CSSProperties["justifyContent"]>
  flexWrap?: Responsive<CSSProperties["flexWrap"]>
  gap?: Responsive<number | string>
  width?: Responsive<number | string>
  useFlexGap?: boolean
  divider?: ReactNode
}

export function FlexStack({
  direction = "column",
  spacing = 0,
  alignItems,
  justifyContent,
  flexWrap,
  gap,
  width,
  divider,
  children,
  sx,
  useFlexGap: _useFlexGap,
  ...props
}: FlexStackProps) {
  void _useFlexGap
  return (
    <Box
      {...props}
      children={
        divider
          ? Children.toArray(children).flatMap((child, index, items) =>
              index < items.length - 1
                ? [
                    child,
                    <Fragment key={`divider-${index}`}>{divider}</Fragment>,
                  ]
                : [child]
            )
          : children
      }
      sx={[
        {
          display: "flex",
          flexDirection: direction,
          gap: gap ?? spacing,
          alignItems,
          justifyContent,
          flexWrap,
          width,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  )
}
