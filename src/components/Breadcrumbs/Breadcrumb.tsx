import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

interface BreadcrumbProps {
  pageName: string;
  link?: string | null;
  session?: string | null;
}

const MyBreadcrumb = ({ pageName, link, session }: BreadcrumbProps) => {
  return (
    <Breadcrumb className="">
      <Breadcrumb.Item>
        {link ? (
          <Link to={link} className="text-title-sm font-semibold text-black">
            {pageName}
          </Link>
        ) : (
          <span className="text-title-sm font-semibold text-black">
            {pageName}
          </span>
        )}
      </Breadcrumb.Item>
      {session && (
        <Breadcrumb.Item>
          {
            <span className="text-title-sm font-semibold text-primary ">
              {session}
            </span>
          }
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
};

export default MyBreadcrumb;
