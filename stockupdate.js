import as from '@lightbend/akkaserverless-javascript-sdk';
const EventSourcedEntity = as.EventSourcedEntity;

const entity = new EventSourcedEntity(
    ["stockupdate.proto", "domain.proto"],
    "stockupdate.StockUpdateService",
    "stock",
    {
      snapshotEvery: 100,
      includeDirs: ['./'],
      serializeAllowPrimitives: true,
      serializeFallbackToJson: true
    }
  );

  const pkg = "stockupdate.domain.";
  const StockAggregated = entity.lookupType(pkg + "StockAggregated");
  const WarehouseStock = entity.lookupType(pkg + "WarehouseStock");

  entity.setInitial(warehouseId => WarehouseStock.create({stocks:[]}))
  entity.setBehavior(warehousestock => {
      return {
          commandHandlers: {
            AggregateStocks: aggregateStocks,
            GetStocks: getStocks
          },
          eventHandlers: {
            StockAggregated: stockAggregated
          }
      };
  });

  function aggregateStocks(aggregateStocks, warehousestock, ctx) {
      if (aggregateStocks.Stocklevel < 1) {
          ctx.fail('cannot add negative stocklevel' + aggregateStocks.StoreUid);
      } else {
          const stockAggregated = StockAggregated.create({
              stock: {
                  StoreUid: aggregateStocks.StoreUid,
                  Stocklevel: aggregateStocks.Stocklevel
              }
          });
          ctx.emit(stockAggregated);
          return {};
      }
  }
  function getStocks(request, warehousestock) {
      return warehousestock;
  }
  function stockAggregated(added, warehousestock) {
      const existing = warehousestock.stocks.find(stock => {
          return stock.StoreUid === added.stock.StoreUid;
      });
      if (existing) {
          existing.Stocklevel = added.stock.Stocklevel
      } else {
          warehousestock.stocks.push(added.stock)
      }
      return warehousestock;
  }
  export default entity;