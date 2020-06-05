import { Icon } from '@blueprintjs/core';

export const columnsNationalCountry = {
  id: 'category',
  accessor: (d) => d.Country,
  width: 400,
  Header: () => (
    <div className="header">
      <span className="year">{'Country'}</span>
      <div className="icons">
        <Icon icon={'caret-up'} iconSize={16} />
        <Icon icon={'caret-down'} iconSize={16} />
      </div>
    </div>
  ),
  style: { whiteSpace: 'unset' },
  Cell: (props) => (
    <div className="category">
      <img
        src={`/images/icons/country/country_${props.original['Country ID'].substr(props.original['Country ID'].length - 3)}.png`}
        alt="icon"
        className="icon"
      />
      <a
        href={`/en/profile/country/${props.original['Country ID'].substr(props.original['Country ID'].length - 3)}`}
        className="link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="name">
          {props.original.Country}
        </div>
        <Icon icon={'chevron-right'} iconSize={14} />
      </a>
    </div>
  )
};

export const columnsNationalProductHS = {
  id: 'category',
  accessor: (d) => d[`${productDepth}`],
  width: 400,
  Header: () => (
    <div className="header">
      <span className="year">{'Product'}</span>
      <div className="icons">
        <Icon icon={'caret-up'} iconSize={16} />
        <Icon icon={'caret-down'} iconSize={16} />
      </div>
    </div>
  ),
  style: { whiteSpace: 'unset' },
  Cell: (props) => (
    <div className="category">
      <img
        src={`/images/icons/hs/hs_${props.original[`${productDepth} ID`].toString().substr(0,props.original[`${productDepth} ID`].toString().length * 1 - productDepth.substr(2) * 1)}.svg`}
        alt="icon"
        className="icon"
      />
      <a
        href={`/en/profile/${productRevision.toLowerCase()}/${props.original[`${productRevision} ID`]}`}
        className="link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="name">
          {props.original[`${productDepth}`]}
        </div>
        <Icon icon={'chevron-right'} iconSize={14} />
      </a>
    </div>
  )
};

export const columnsNationalProductSITC = {
  id: 'category',
  accessor: (d) => d[`${productRevision}`],
  width: 400,
  Header: () => (
    <div className="header">
      <span className="year">{'Product'}</span>
      <div className="icons">
        <Icon icon={'caret-up'} iconSize={16} />
        <Icon icon={'caret-down'} iconSize={16} />
      </div>
    </div>
  ),
  style: { whiteSpace: 'unset' },
  Cell: (props) => (
    <div className="category">
      <img
        src={`/images/icons/sitc/sitc_${props.original[`${productRevision} ID`].toString().charAt(0)}.svg`}
        alt="icon"
        className="icon"
      />
      <a
        href={''}
        className="link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="name">
          {props.original[`${productRevision}`]}
        </div>
        <Icon icon={'chevron-right'} iconSize={14} />
      </a>
    </div>
  )
};
