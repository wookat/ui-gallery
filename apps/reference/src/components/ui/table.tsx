import * as React from "react"
import { cn } from "cn"

/** 表格：hifi table —— th caption/fg-muted、td space.3、hairline 行线、末行无线、首末列去内距、hover 行底 bg */
function TableWrap({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="table-wrap" className={cn("relative -mx-6 overflow-x-auto px-6", className)} {...props} />
}

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return <table data-slot="table" className={cn("w-full border-collapse text-role-body", className)} {...props} />
}

function TableHeader(props: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child_td]:border-b-0", className)} {...props} />
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn("transition-colors duration-(--motion-fast) ease-std hover:[&>td]:bg-bg", className)} {...props} />
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn("border-b px-3 py-2 text-left text-role-caption font-medium whitespace-nowrap text-fg-muted first:pl-0 last:pr-0", className)}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn("border-b p-3 align-middle whitespace-nowrap first:pl-0 last:pr-0", className)} {...props} />
}

export { TableWrap, Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
