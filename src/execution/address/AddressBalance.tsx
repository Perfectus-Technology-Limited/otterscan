import { FC } from "react";

type AddressBalanceProps = {
  balance: number;
};

const AddressBalance: FC<AddressBalanceProps> = ({ balance }) => {
  return (
    <div className="space-x-2">
      <span className="text-sm" title={`${balance} WSO2`}>
        <span className="font-balance">{balance}</span> WSO2
      </span>
    </div>
  );
};

export default AddressBalance;
