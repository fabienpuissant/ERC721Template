import React from 'react'
import {Toolbar, AppBar, Grid} from "@material-ui/core"

export default function CustomAppBar({account}) {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Grid container>
                    <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                        CryptElement
                    </Grid>
                    <Grid item xl={8} lg={8} md={8} sm={8} xs={8} align="right">
                        {account}
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}
