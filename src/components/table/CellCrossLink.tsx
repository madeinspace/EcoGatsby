import * as _ from 'lodash';
import * as React from 'react';

interface ICellCrossLinkProps {
  crosslink: any;
}

interface ICrossLink {
  url: string;
  linkText: string;
  cssClass: string;
}

export default function CellCrossLink(props: ICellCrossLinkProps) {
  const { crosslink } = props;
  return (
    <a
      target="_blank"
      title={crosslink.linkText}
      className={crosslink.cssClass}
      href={crosslink.url}
    />
  );
}
