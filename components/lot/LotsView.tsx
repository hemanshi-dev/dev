import {Lot} from "../../lib/types";
import {Grid, ScrollArea} from "@mantine/core";
import LotCompactCard from "../auction/LotCompactCard";
import {useAtom} from "jotai/index";
import {configurationAtom} from "../../src/atoms/stateAtoms";

export default function LotsView({lots, span = {base: 12, sm: 6, lg: 4}}: {
    lots: Lot[],
    span?: { base: number, sm: number, lg: number }
}) {

    const [configurations,] = useAtom(configurationAtom)

    const getMenuFooterTotals = () => {
        return configurations.footerHeight + configurations.navMenuHeight + configurations.menuRibbonHeight
    }

    return (<ScrollArea scrollbars={'y'} h={{
            base: `calc(100vh - ${getMenuFooterTotals() + 50}px)`,
            md: `calc(100vh - ${getMenuFooterTotals() + 20}px)`,
        }}>
            <Grid>
                {
                    lots.map((lot, index) =>
                        <Grid.Col span={span}>
                            <LotCompactCard lot={lot} key={index}/>
                        </Grid.Col>
                    )
                }
            </Grid>


        </ScrollArea>
    );
}