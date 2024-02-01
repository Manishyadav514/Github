import React from "react";
import Link from "next/link";

interface BreadcrumbInterface {
  label: string;
  to: string;
}

interface PropTypes {
  breadCrumbList: BreadcrumbInterface[];
  currentPath: string;
  customClassname?: string;
}
const defaultProps = {
  customClassname: "",
};
const BreadCrumb = (props: PropTypes) => {
  const { breadCrumbList, currentPath, customClassname } = props;
  return (
    <ul className={`${customClassname} truncate`} role="list">
      {breadCrumbList.map(d => (
        <li
          key={`breadcrumb_label_${d.label}`}
          className="inline cursor-pointer text-sm text-gray-600 capitalize"
          itemProp="name"
          role="listitem"
        >
          <Link href={d.to} passHref aria-label={d.label}>
            {d.label}/
          </Link>
        </li>
      ))}
      <li className="inline active text-sm  font-bold capitalize" dangerouslySetInnerHTML={{ __html: currentPath }}></li>
    </ul>
  );
};
BreadCrumb.defaultProps = defaultProps;

export default React.memo(BreadCrumb);
