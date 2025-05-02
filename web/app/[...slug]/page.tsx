import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { ContentDisplay } from "@/components/content-display/content-display";
import { SearchButton } from "@/components/search-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { Navigation } from "@/server/db/schema";
import { api, HydrateClient } from "@/trpc/server";
import { Separator } from "@radix-ui/react-separator";
import { Fragment, Suspense } from "react";

type Params = Promise<{ slug: string[] }>;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const url = `/${slug.join("/")}`;

  return (
    <HydrateClient>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-3">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Suspense fallback={<BreadcrumbsLoading />}>
              <Breadcrumbs url={url} />
            </Suspense>
          </div>
          <SearchButton className="ml-auto" />
        </header>
        <main className="flex flex-1 flex-col p-6">
          <Content url={url} />
        </main>
      </SidebarInset>
    </HydrateClient>
  );
}

async function Content({ url }: { url: string }) {
  const content = await api.pages.get({ url });

  if (!content) {
    return (
      <main className="flex flex-1 flex-col p-6">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Content Not Found</h2>
            <p className="text-muted-foreground">
              The requested content could not be found.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return <ContentDisplay content={content} />;
}

function BreadcrumbsLoading() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Docco</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function createBreadcrumbs(navigation: Navigation, url: string): string[] {
  for (const navItem of navigation) {
    if (navItem.url && navItem.url === url) {
      return [navItem.title];
    }

    if (navItem.items) {
      const found = createBreadcrumbs(navItem.items, url);
      if (found.length > 0) {
        return [navItem.title, ...found];
      }
    }
  }
  return [];
}

async function Breadcrumbs({ url }: { url: string }) {
  const navigation = await api.navigation.get();
  if (!navigation) {
    return null;
  }

  const breadcrumbs = createBreadcrumbs(navigation, url);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Docco</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((crumb, index) => (
          <Fragment key={index}>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem
              className={cn({
                "hidden md:block": index < breadcrumbs.length - 1,
              })}
            >
              <BreadcrumbPage>{crumb}</BreadcrumbPage>
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
