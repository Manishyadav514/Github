import Navbar from "./Navbar"
import UtilityAPI from "../api/utility";
import { useState, useEffect } from "react";
import { formatDate } from "./format";
const ViewBids = () => {
    const [bids, setBids] = useState();
    const [ascFlag, setAscFlag] = useState();

    useEffect(() => {
        getAllTenders()
    }, []);

    function sortBids() {
        const sortedArray = bids.slice().sort((a, b) => {
            const bidCostA = a.bidCost || 0;
            const bidCostB = b.bidCost || 0;

            if (ascFlag) {
                setAscFlag(false)
                return bidCostA - bidCostB;
            } else {
                setAscFlag(true)
                return bidCostB - bidCostA;
            }
        });
        console.log(sortedArray, ascFlag)
        setBids(sortedArray);
    }

    const getAllTenders = async () => {
        let manaementAPI = new UtilityAPI();
        try {
            const response = await manaementAPI.fetchTenderBids();
            setBids(response.data)
        } catch (error) {
            console.error("API call error:", error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="bg-gray-200 min-h-[90vh] flex flex-col items-center justify-center">
                <div className="h-full flex flex-col bg-white rounded-lg shadow-md w-full p-20">
                    <h1 className="text-2xl font-semibold text-center text-gray-900 mb-4">Availale BIds</h1>
                    <button className="mb-10 items-start w-[300px] text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800" onClick={() => sortBids()}>Sort ASC/DESC</button>
                    <div className="relative overflow-x-auto shadow-md">
                        <table className="w-full rounded-md text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="rounded text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>

                                    {Object.values(keysColRow)?.map((item) => {
                                        return (
                                            <th scope="col" className="px-6 py-3" key={item}>
                                                <div className="flex items-center">
                                                    {item}
                                                    {/* {item === "bidcost" && <span onClick={() => sortBids()} href="#"><svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                                    </svg></span>} */}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {bids?.length &&
                                    bids?.map((item, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-900"
                                            >
                                                {Object.keys(keysColRow)?.map((key) => {
                                                    return <td scope="col" className="px-6 py-4" key={`${index}-${key}-0`}>{key === "bidTime" ? formatDate(item?.[key]) : item?.[key]}</td>;
                                                })}
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ViewBids


export const keysColRow = {
    tenderId: "tender id",
    userId: "user id",
    bidTime: "bid time",
    bidCost: "bidcost",
};