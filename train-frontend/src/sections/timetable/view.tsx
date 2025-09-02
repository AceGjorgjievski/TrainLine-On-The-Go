"use client";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import getTimetableForRouteName from "@/services/timetable.service";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
} from "@mui/material";
import { TimetableDTO } from "@/types/TimetableDTO";
import { StationDTO } from "@/types/stationDTO";

export default function TimeTableView() {
  const [mode, setMode] = useState<"departure" | "arrival">("departure");
  const [timetables, setTimetables] = useState<TimetableDTO[]>([]);
  useEffect(() => {
    getTimetableForRouteName(mode)
        .then((data) => {
             const normalized = Array.isArray(data) ? data : [data];
            setTimetables(normalized);
        })
        .catch((err) => console.error(err))
  }, [mode]);

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div>
      <RadioGroup
        row
        value={mode}
        onChange={(e) => setMode(e.target.value as "departure" | "arrival")}
      >
        <FormControlLabel
          value="departure"
          control={<Radio />}
          label="Departure from Skopje"
        />
        <FormControlLabel
          value="arrival"
          control={<Radio />}
          label="Arrival to Skopje"
        />
      </RadioGroup>
      <div>
        {timetables?.map((route, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                {route.routeName}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Train timetable
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>СТАНИЦА</TableCell>
                    {route.trains.map((train: string, tIdx: number) => (
                      <TableCell key={tIdx}>ВОЗ - {train}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {route.stations.map((station: StationDTO, sIdx: number) => (
                    <TableRow key={sIdx}>
                      <TableCell>{station.stationName}</TableCell>
                      {station.times.map((time, timeIdx) => (
                        <TableCell key={timeIdx}>{time}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
