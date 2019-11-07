import React, { useState, useEffect } from 'react';

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

    return (
        <div>
            <h3>Blocks</h3>
            {blocks.map(block => (
                <div key={block.hash}>
                    {block.hash}
                </div>
            ))}
        </div>
    );
};

export default Blocks;