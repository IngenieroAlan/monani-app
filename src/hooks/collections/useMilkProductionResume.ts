import MonthlyMilkProduction from "@/database/models/MonthlyMilkProduction";
import { TableName } from "@/database/schema";
import { useDatabase } from "@nozbe/watermelondb/react";
import { useEffect, useState } from "react";

export interface YearlyMilkProduction {
  year: number;
  totalLiters: number;
  monthlyAverage: number;
  differenceFromPreviousYear: number | null;
  monthlyBreakdown: { month: string; liters: number }[];
}

export const useMilkProductionResume = () => {
  const database = useDatabase();
  const [milkProductionResumeRecords, setMilkProductionResumeRecords] =
    useState<MonthlyMilkProduction[]>();
  const [totalLiters, setTotalLiters] = useState<number>(0);
  const [annualAverage, setAnnualAverage] = useState<number>(0);
  const [yearlyMilkProductionData, setYearlyMilkProductionData] = useState<
    Record<number, YearlyMilkProduction>
  >({});

  const monthlyNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  let monthlyMilkProductionQuery = database.collections
    .get<MonthlyMilkProduction>(TableName.MONTHLY_MILK_PRODUCTION)
    .query();

  useEffect(() => {
    const milkProductionSubscription = monthlyMilkProductionQuery
      .observeWithColumns(["updated_at"])
      .subscribe((data) => {
        if (!data) {
          setMilkProductionResumeRecords([]);
          setYearlyMilkProductionData({});
          setTotalLiters(0);
          setAnnualAverage(0);
          return;
        }

        setMilkProductionResumeRecords(data);

        // Procesar los datos para agrupar por año y calcular total y promedio
        const groupedByYear: Record<number, YearlyMilkProduction> = {};
        let totalLitersSum = 0;

        data.forEach((record) => {
          const year = record.year;
          const monthIndex = record.month - 1;
          const monthName = monthlyNames[monthIndex];
          const liters = record.liters;

          // Acumular total de litros para todos los registros
          totalLitersSum += liters;

          if (!groupedByYear[year]) {
            groupedByYear[year] = {
              year,
              totalLiters: 0,
              monthlyAverage: 0,
              differenceFromPreviousYear: null,
              monthlyBreakdown: []
            };
          }

          groupedByYear[year].totalLiters += liters;
          groupedByYear[year].monthlyBreakdown.push({ month: monthName, liters });
        });

        // Completar los meses faltantes con 0 litros y ordenarlos de enero a diciembre
        Object.values(groupedByYear).forEach((yearData) => {
          const existingMonths = new Set(yearData.monthlyBreakdown.map((monthData) => monthData.month));

          // Llenar los meses faltantes con 0 litros y ordenarlos
          for (let month = 0; month < 12; month++) {
            const monthName = monthlyNames[month];
            if (!existingMonths.has(monthName)) {
              yearData.monthlyBreakdown.push({ month: monthName, liters: 0 });
            }
          }

          // Ordenar los meses de enero a diciembre
          yearData.monthlyBreakdown.sort((a, b) => {
            const monthIndexA = monthlyNames.indexOf(a.month);
            const monthIndexB = monthlyNames.indexOf(b.month);
            return monthIndexA - monthIndexB;
          });

          // Calcular el promedio mensual
          yearData.monthlyAverage = yearData.totalLiters / 12;

          // Calcular la diferencia con el año anterior
          const sortedYears = Object.keys(groupedByYear)
            .map(Number)
            .sort((a, b) => a - b);

          const yearIndex = sortedYears.indexOf(yearData.year);
          if (yearIndex > 0) {
            const previousYear = sortedYears[yearIndex - 1];
            yearData.differenceFromPreviousYear = yearData.totalLiters - groupedByYear[previousYear].totalLiters;
          }
        });

        // Asignar total de litros y promedio anual general
        setTotalLiters(totalLitersSum);
        const allMonths = data.length;
        setAnnualAverage(allMonths > 0 ? totalLitersSum / allMonths : 0);

        setYearlyMilkProductionData(groupedByYear);
      });

    return () => {
      milkProductionSubscription.unsubscribe();
    };
  }, [database]);

  return {
    milkProductionResumeRecords,
    totalLiters,
    annualAverage,
    yearlyMilkProductionData,
  };
};
