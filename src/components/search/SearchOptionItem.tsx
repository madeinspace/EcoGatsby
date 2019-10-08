import * as React from 'react';

interface SearchOptionItemProps {
  option: string;
  cssClass: string;
  handleClick: (option: string) => void;
}

const SearchOptionItem: React.FunctionComponent<
  SearchOptionItemProps
> = props => {
  const { handleClick, option, cssClass } = props;
  return (
    <a id={option} onClick={() => handleClick(option)} className={cssClass}>
      {option}
    </a>
  );
};

export default SearchOptionItem;
