import cors from 'cors';
import express from 'express';
import knex from 'knex';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const handleAggregateOptions = (qb, aggregateOpts, aggregationColumn) => {
    const operations = ['count', 'sum', 'max', 'min', 'avg'];
    operations.forEach((op) => {
        if (aggregateOpts && aggregateOpts[op]) {
            qb[op](aggregationColumn);
        }
    });
};

app.post('/api/query', (req, res) => {
    const { formula } = req.body;
    const knexQb = knex({ client: 'mssql' }).queryBuilder();

    if (formula.from) {
        knexQb.from(formula.from);
    }

    if (formula.aggregate) {
        handleAggregateOptions(knexQb, formula.aggregateOpts, formula.aggregationColumn);
    }

    const query = knexQb.toString();

    res.send({ query });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
