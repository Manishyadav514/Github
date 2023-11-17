interface BreadcrumbProps {
  name: string;
  routerLink?: string | [string];
}

const HOME = {
  name: "Home",
  routerLink: "/"
};

export const homePageBreadcrumb = [
  HOME,
  {
    name: "Community Feed",
    routerLink: ["/community-feed"]
  },
  {
    name: "Create a new Post"
  }
];

export const GoodPointsBreadcrumb: BreadcrumbProps[] = [
  HOME,
  {
    name: "glammPoints List",
    routerLink: ["/goodpoints"]
  }
];

export const GoodUploadBreadcrumb: BreadcrumbProps[] = [
  HOME,
  {
    name: "glammPoints List",
    routerLink: ["/goodpoints"]
  },
  {
    name: "Add goodPOINTS",
    routerLink: ["/goodpoints/add"]
  }
];

export const MembersBreadcrumb: BreadcrumbProps[] = [
  HOME,
  {
    name: "Members",
    routerLink: ["/members"]
  }
];

export const OrderBreadcrumb = [
  HOME,
  {
    name: "Orders",
    routerLink: ["/order"]
  }
];

export const PartyThemeBreadcrumb = [
  HOME,
  {
    name: "Party Theme"
  }
];

export const LinkBuilderBreadcrumb = [
  {
    name: "Home",
    routerLink: "/",
  },
  {
    name: "Link Builder",
    routerLink: ["/link-builder"],
  },
];
export const TagManagerBreadcrumb = {
  listing: [
    {
      name: "Tag Manager",
      routerLink: ["/tag-manager"]
    }
  ],
  add: [
    HOME,
    {
      name: "Tag Manager",
      routerLink: ["/tag-manager"]
    },
    {
      name: 'Add New Tag'
    }
  ],
  edit: [
    {
      name: "Tag Manager",
      routerLink: ["/tag-manager"]
    },
    {
      name: 'Edit Tag'
    }
  ]
};
export const MailTemplateBreadcrumb: BreadcrumbProps[] = [
  HOME,
  {
    name: "Mail Template",
    routerLink: ["/mail-templates"]
  }
];

export const MAILTEMPLATES_BREADCRUMBLIST = {
  listing: [HOME, { name: 'Mail Templates' }],
  add: [
    HOME,
    {
      name: 'Mail Templates',
      routerLink: ['/mail-templates']
    },
    {
      name: 'Add New Mail Template'
    }
  ],
  edit: [
    HOME,
    {
      name: 'Mail Templates',
      routerLink: ['/mail-templates']
    },
    {
      name: 'Edit Mail Template'
    }
  ]
};