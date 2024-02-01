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
    <ul className={`${customClassname} truncate`}>
      {breadCrumbList.map(d => (
        <li
          key={`breadcrumb_label_${d.label}`}
          className="inline cursor-pointer text-base text-gray-600 capitalize"
          itemProp="name"
        >
          <Link href={d.to} passHref legacyBehavior>
            <a>{d.label}&nbsp;&nbsp;/&nbsp;&nbsp;</a>
          </Link>
        </li>
      ))}
      <li className="inline active text-base  font-bold capitalize" dangerouslySetInnerHTML={{ __html: currentPath }} />
    </ul>
  );
};
BreadCrumb.defaultProps = defaultProps;

export default React.memo(BreadCrumb);
