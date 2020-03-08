import React from 'react';
import { Link } from 'gatsby';

import { validateRoot } from '../../utils/router';

import './index.scss';

export const Header = ({ title, location, rootPath }) => {
  const isRoot = validateRoot(location, rootPath);
  return (
    isRoot && (
      <h1 className="home-header">
        <Link to={`/`} className="link">
          {title}
        </Link>
      </h1>
    )
  );
};
