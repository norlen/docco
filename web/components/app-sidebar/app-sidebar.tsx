import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { NavigationItem } from "@/server/db/schema";
import { api } from "@/trpc/server";
// import { api } from "@/trpc/react";
import { GalleryVerticalEnd } from "lucide-react";
import * as React from "react";

// type NavigationItemWithActive = {
//   title: string;
//   contentId?: string;
//   url?: string;
//   isActive: boolean;
//   items: NavigationItemWithActive[];
// };

// // Process the navigation data to mark active items
// function processNavigationData(
//   data: NavigationItem[],
//   currentPath: string,
// ): NavigationItemWithActive[] {
//   return data.map((item) => {
//     const isActive = currentPath === item.url;
//     const items =
//       item.items && item.items.length > 0
//         ? processNavigationData(item.items, currentPath)
//         : [];

//     return { ...item, items, isActive };
//   });
// }

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // const pathname = usePathname();
  // const [navigation] = await api.navigation.get.useSuspenseQuery();
  // const navigationData = React.useMemo(() => {
  //   if (navigation) {
  //     return processNavigationData(navigation, pathname);
  //   }
  //   return [];
  // }, [navigation, pathname]);
  const navigation = await api.navigation.get();

  // Temporary...
  if (!navigation) {
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Docco</span>
                <span className="">latest</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu></SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>;
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Docco</span>
                  <span className="">latest</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {navigation!.map((item, index) => (
              <AppSidebarMenuItem key={index} navItem={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

type AppSidebarMenuItemProps = React.ComponentProps<typeof SidebarMenuItem> & {
  navItem: NavigationItem;
};

function AppSidebarMenuItem({ navItem, ...props }: AppSidebarMenuItemProps) {
  return (
    <SidebarMenuItem key={navItem.title} {...props}>
      <SidebarMenuButton asChild>
        {navItem.contentId && navItem.url ? (
          <a href={navItem.url} className="font-medium">
            {navItem.title}
          </a>
        ) : (
          <p>{navItem.title}</p>
        )}
      </SidebarMenuButton>
      {navItem.items?.length ? (
        <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
          {navItem.items.map((item, index) => (
            <AppSidebarMenuItem key={index} navItem={item} />
          ))}
        </SidebarMenuSub>
      ) : null}
    </SidebarMenuItem>
  );
}
