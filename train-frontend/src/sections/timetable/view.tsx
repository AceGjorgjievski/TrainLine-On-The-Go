"use client";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import getTimetableForRouteName from "@/services/timetable.service";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Container,
  colors,
} from "@mui/material";
import { TimetableDTO, StationDTO } from "@/types";
import { DirectionSelector } from "@/shared/components";
import { useTranslations } from "next-intl";

export default function TimeTableView() {
  const [direction, setDirection] = useState<"departure" | "arrival" | "">("");
  const [timetables, setTimetables] = useState<{
    [key: string]: TimetableDTO[];
  }>({});
  const tTimetable = useTranslations("Timetable");
  const tRoutes = useTranslations("Timetable.routes");
  const tStations = useTranslations("Timetable.stations")

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const directions: Array<"departure" | "arrival"> = ["departure", "arrival"];

    Promise.all(
      directions.map((dir) =>
        getTimetableForRouteName(dir).then((data) => ({
          direction: dir,
          timetables: Array.isArray(data) ? data : [data],
        }))
      )
    )
      .then((results) => {
        const timetableMap: { [key: string]: TimetableDTO[] } = {};
        results.forEach((result) => {
          timetableMap[result.direction] = result.timetables;
        });
        setTimetables(timetableMap);
      })
      .catch((err) => console.error(err));
  }, []);

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleDirectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirection(e.target.value as "departure" | "arrival");
    setExpanded(false);
  };

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <>
      <DirectionSelector
        direction={direction}
        handleDirectionChange={handleDirectionChange}
      />
      {direction && timetables[direction]?.length > 0 && (
        <Container
          sx={{
            borderRadius: 4,
            boxShadow: 10,
            pt: 2,
            pb: 1,
            mt: 5,
            mb: 2,
            border: "2px solid",
          }}
        >
          {timetables[direction]?.map((route, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              sx={{
                ...(expanded === `panel${index}` && {
                  borderColor: colors.purple[500],
                  bgcolor: colors.purple[50],
                }),
                width: "100%",
                mt: 2,
                mb: 2,
                border: "2px solid",
                borderRadius: 2,
                boxShadow: 4,
                bgcolor: "background.paper",
                "&:hover": {
                  boxShadow: 8,
                  borderColor: colors.purple[400],
                },
              }}
              onChange={handleChange(`panel${index}`)}
              TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
              >
                <Typography
                  sx={{
                    width: "33%",
                    flexShrink: 0,
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    color: colors.purple[700],
                  }}
                >
                  {tRoutes(route.routeName.toLowerCase().replace(/\s+/g, "").replace("-", "-"))}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  transition: "all 0.3s ease-in-out",
                  bgcolor: colors.grey[50],
                  borderTop: "1px solid",
                  borderColor: colors.grey[300],
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography
                          sx={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          {tTimetable("station")}
                        </Typography>
                      </TableCell>
                      {route.trains.map((train: string, tIdx: number) => (
                        <TableCell key={tIdx}>
                          <Typography
                            sx={{ fontWeight: "bold", textAlign: "center" }}
                          >
                            {tTimetable(train.split(" ")[0].toLocaleLowerCase()) + " " + train.split(" ")[1]}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {route.stations.map((station: StationDTO, sIdx: number) => (
                      <TableRow
                        key={sIdx}
                        sx={{
                          bgcolor: sIdx % 2 === 0 ? colors.blue[50] : "white",
                        }}
                      >
                        <TableCell>
                          <Typography sx={{ textAlign: "center" }}>
                            {tStations(station.stationName)}
                          </Typography>
                        </TableCell>
                        {station.times.map((time, timeIdx) => (
                          <TableCell key={timeIdx}>
                            <Typography sx={{ textAlign: "center" }}>
                              {time}
                            </Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      )}
    </>
  );
}
