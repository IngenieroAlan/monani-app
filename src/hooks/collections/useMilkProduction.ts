import { MilkProductionsCol as Column, TableName } from "@/database/constants";
import MilkProduction from "@/database/models/MilkProduction";
import { Q } from "@nozbe/watermelondb";
import { useDatabase } from "@nozbe/watermelondb/react";
import { useEffect, useState } from "react";

export const SORT_ORDERS = { asc: "ASC", desc: "DESC" };

interface Props {
  take?: number;
  betweenDates?: number[] | null;
  year?: number | null;
  order?: string | null;
}

const useMilkProduction = ({ take, betweenDates, year, order }: Props) => {
  const database = useDatabase();
  const [milkProductionRecords, setMilkProductionRecords] =
    useState<MilkProduction[]>();
  let milkProductionQuery = database.collections
    .get<MilkProduction>(TableName.MILK_PRODUCTIONS)
    .query(
      Q.sortBy(Column.PRODUCED_AT,Q.desc)
    );
  if (take) {
    milkProductionQuery = milkProductionQuery.extend(Q.take(take));
  }
  if (betweenDates?.length) {
    milkProductionQuery = milkProductionQuery.extend(
      Q.where(Column.PRODUCED_AT, Q.between(betweenDates[0], betweenDates[1]))
    );
  }
  if (year) {
    milkProductionQuery = milkProductionQuery.extend(
      Q.unsafeSqlExpr(
        `strftime('%Y', datetime(sold_at / 1000, 'unixepoch')) = '${year}'`
      )
    );
  }
  useEffect(() => {
    const milkProductionSubscription = milkProductionQuery
      .observeWithColumns([Column.PRODUCED_AT])
      .subscribe((data) => {
        setMilkProductionRecords( order && order === SORT_ORDERS.desc ? data : data.toReversed());
      });

    return () => {
      milkProductionSubscription.unsubscribe();
    };
  }, [database, take, betweenDates, year, order]);

  return {
    milkProductionRecords,
  };
};

export default useMilkProduction;
