import React from 'react';
import { CgSpinner } from 'react-icons/cg';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <CgSpinner className="animate-spin text-4xl text-indigo-600" />
    </div>
  );
};

export default Spinner;