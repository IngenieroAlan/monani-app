import Cattle, { CattleStatus, ProductionType } from "@/database/models/Cattle";
import { TableName } from "@/database/schema";
import { Q } from "@nozbe/watermelondb";
import { useDatabase } from "@nozbe/watermelondb/react";
import { useEffect, useState } from "react";

type UseCattleProps = {
  cattleStatus?: CattleStatus[] | Set<CattleStatus>;
  productionType?: ProductionType | null;
  take?: number;
};

const useCattle = ({
  cattleStatus,
  productionType,
  take,
}: UseCattleProps = {}) => {
  const database = useDatabase();
  const [cattleRecords, setCattleRecords] = useState<Cattle[]>([]);

  let cattleQuery = database.collections.get<Cattle>(TableName.CATTLE).query();

  if (take) {
    cattleQuery = cattleQuery.extend(Q.take(take));
  }
  if (cattleStatus && Array.from(cattleStatus).length) {
    cattleQuery = cattleQuery.extend(
      Q.where("cattle_status", Q.oneOf(Array.from(cattleStatus)))
    );
  }
  if (productionType) {
    cattleQuery = cattleQuery.extend(
      Q.where("production_type", productionType)
    );
  }

  useEffect(() => {
    const subscription = cattleQuery.observe().subscribe((data) => {
      setCattleRecords(data);
    });

    return () => subscription.unsubscribe();
  }, [database, cattleStatus, productionType, take]);

  const getCattle = async (extend: Q.Clause[]) => {
    return await database.collections
      .get<Cattle>(TableName.CATTLE)
      .query()
      .extend(extend)
      .fetch();
  };

  return {
    cattleRecords,
    getCattle,
  };
};

export default useCattle;
