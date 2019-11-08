import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Block from './Block';

const Blocks = () => {
    const [blocks, setBlocks] = useState([]);
    const [paginatedId, setPaginatedId] = useState(1);
    const [blocksLength, setBlocksLength] = useState(0);

    const fetchPaginatedBlocks = useCallback(async(id) => {
        try{
            const resp = await fetch(`${document.location.origin}/api/blocks/${id}`);
            const data = await resp.json();
            setBlocks(data);
        } catch(err){
            console.log(err);
        }
    }, []);

    useEffect(() => {
        fetchPaginatedBlocks(paginatedId);
    }, [fetchPaginatedBlocks, paginatedId]);

    useEffect(() => {
        async function fetchData(){
            try{
                const resp = await fetch(`${document.location.origin}/api/blocks/length`);
                const data = await resp.json();
                setBlocksLength(data);
            } catch(err){
                console.log(err);
            }
        }
        fetchData();
    }, []);

    if(blocks.length === 0){
        return <div><em>loading blocks...</em></div>;
    }

    return (
        <div>
            <div><Link to='/'>Home</Link></div>
            <h3>Blocks</h3>
            <div>
                {[...Array(Math.ceil(blocksLength / 5)).keys()].map(key => {
                    const pageId = key + 1;
                    return (
                        <span key={key} onClick={() => setPaginatedId(pageId)}>
                            <Button variant='danger' size='xs'>
                                {pageId}
                            </Button>{' '}
                        </span>
                    );
                })}
            </div>
            {blocks.map(block => (
                <Block key={block.hash} block={block} />
            ))}
        </div>
    );
};

export default Blocks;