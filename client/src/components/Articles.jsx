import React from 'react';
import {Article} from "./Article";
import Stack from "react-bootstrap/Stack";
export const Articles = ({articles}) => {
    return (
        <div>
            <Stack gap={5}>
                {articles.map((article) => { return <Article article={article} article_id={article.id}/>})}
            </Stack>
        </div>
    )
}