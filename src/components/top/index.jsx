import React from 'react';
import { Link } from 'gatsby';

import { GitHubIcon } from '../social-share/github-icon';
import { validateRoot } from '../../utils/router';

import './index.scss';

export const Top = ({ title, location, rootPath }) => {
  const isRoot = validateRoot(location, rootPath);
  return (
    <div className="top">
      {!isRoot && (
        <Link to={`/`} className="link">
          {title}
        </Link>
      )}
      <GitHubIcon />
    </div>
  );
};
