import React, { useState, useEffect } from 'react';
import Block from './Block';

const Blocks = () => {
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        async function fetchData(){
            try{
                const resp = await fetch('http://localhost:4000/api/blocks');
                const data = await resp.json();
                setBlocks(data);
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
            <h3>Blocks</h3>
            {blocks.map(block => (
                <Block key={block.hash} block={block} />
            ))}
        </div>
    );
};

export default Blocks;