import React, { ReactElement } from "react";

import CustomLayout from "@libLayouts/CustomLayout";

import AddressForm from "@libComponents/Form/AddressForm";

const AddAddress = () => <AddressForm isAddAddress />;

AddAddress.getLayout = (page: ReactElement) => (
  <CustomLayout header="deliverToThisAddress" fallback="Deliver to this Address">
    {page}
  </CustomLayout>
);

export default AddAddress;
