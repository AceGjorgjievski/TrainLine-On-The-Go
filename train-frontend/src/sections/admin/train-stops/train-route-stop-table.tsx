import { TrainRouteStop } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Typography,
  colors,
} from "@mui/material";
import { useTranslations } from "next-intl";
type SortKey = "trainStop.name" | "stationSequenceNumber";

interface Props {
  stops: TrainRouteStop[];
  page: number;
  rowsPerPage: number;
  handleSortRequest: (key: SortKey) => void;
  handleSortIcon: (key: SortKey) => string | null;
}

export default function TrainRouteStopTable({
  stops,
  page,
  rowsPerPage,
  handleSortRequest,
  handleSortIcon,
}: Props) {
  const paginated = stops.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const tAdminTrains = useTranslations("AdminPage");

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell
            onClick={() => handleSortRequest("trainStop.name")}
            sx={{
              cursor: "pointer",
              textDecoration: "underline",
              width: 200,
            }}
            align="center"
          >
            <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
              {tAdminTrains("table.name")} {handleSortIcon("trainStop.name")}
            </Typography>
          </TableCell>
          <TableCell
            onClick={() => handleSortRequest("stationSequenceNumber")}
            sx={{
              cursor: "pointer",
              textDecoration: "underline",
              width: 200,
            }}
          >
            <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
              {tAdminTrains("table.sequence")} {handleSortIcon("stationSequenceNumber")}
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {paginated.map((stop, index) => (
          <TableRow
            key={stop.id || index}
            sx={{
              bgcolor: index % 2 === 0 ? colors.blue[50] : "white",
            }}
          >
            <TableCell align="center">
              <Typography sx={{ textAlign: "center" }}>
                {tAdminTrains("stations." + stop.trainStop.name)}
              </Typography>
            </TableCell>
            <TableCell width={100}>
              <Typography sx={{ textAlign: "center" }}>
                {stop.stationSequenceNumber}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
