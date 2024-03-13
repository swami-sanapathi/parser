import cors from 'cors';
import express from 'express';
import knex from 'knex';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const handleAggregateOptions = (qb, aggregateOpts, aggregationColumn) => {
    if (aggregateOpts.count) {
        qb.count(aggregationColumn);
    }
    if (aggregateOpts.sum) {
        qb.sum(aggregationColumn);
    }
    if (aggregateOpts.avg) {
        qb.avg(aggregationColumn);
    }
    if (aggregateOpts.min) {
        qb.min(aggregationColumn);
    }
    if (aggregateOpts.max) {
        qb.max(aggregationColumn);
    }
};

app.post('/api/query', (req, res) => {
    const { formula } = req.body;
    const knexQb = knex({ client: 'mssql' }).queryBuilder();

    if (!formula.from) return res.send({ error: 'FROM clause is not supported' });

    if (formula.from) {
        knexQb.from(formula.from);
    }

    if (formula.aggregate) {
        handleAggregateOptions(knexQb, formula.aggregateOpts, formula.aggregationColumn);
    }

    if(formula.where) {
        knexQb.whereRaw(formula.whereOpts.identifier);
    }

    const query = knexQb.toString();

    res.send({ query });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
