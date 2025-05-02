import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { SearchButton } from "@/components/search-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { HydrateClient } from "@/trpc/server";
import { Separator } from "@radix-ui/react-separator";

export default async function Home() {
  return (
    <HydrateClient>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-3">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Docco</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <SearchButton className="ml-auto" />
        </header>
        <main className="flex flex-1 flex-col p-6">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                Select a topic from the sidebar
              </h2>
              <p className="text-muted-foreground">
                Choose a documentation page to view its content
              </p>
            </div>
          </div>
        </main>
      </SidebarInset>
    </HydrateClient>
  );
}
