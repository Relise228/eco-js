import React from 'react';
import s from './BoxValue.module.sass';

function BoxValue({Designation, Bottom_Border, Upper_Border}) {
  const upper = Upper_Border ? Upper_Border : 'Higher';
  return (
    <div className={s.boxValue}>
      <div className={s.boxValueHeader}>{Designation}</div>
      <div className={s.boxValueVal}>
        {Bottom_Border} - {upper}
      </div>
    </div>
  );
}

export default BoxValue;
