import { View } from "@lightbend/akkaserverless-javascript-sdk";

const view = new View(
    ["view.proto", "domain.proto"],
    "stockupdate.view.StockByStoreUid",
    {
        viewId: "stockudpate-view"
    }
);
view.setUpdateHandlers({
    ProcessStockAggregated: StockAggregated
})
function StockAggregated(event, stock, ctx) {
    stock.Stocklevel = event.Stocklevel
}
export default view;
