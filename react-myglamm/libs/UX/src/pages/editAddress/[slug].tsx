import React, { ReactElement } from "react";

import CustomLayout from "@libLayouts/CustomLayout";
import AddressForm from "@libComponents/Form/AddressForm";

const EditAddress = () => <AddressForm isAddAddress={false} />;

EditAddress.getLayout = (page: ReactElement) => <CustomLayout header="editAddress">{page}</CustomLayout>;

export default EditAddress;
