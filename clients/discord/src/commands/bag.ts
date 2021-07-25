import { Command } from 'comtroller';
import { getUserItems } from 'yeonna-core';
import { Message } from 'discord.js';
import { table } from 'table';

export const bag: Command =
{
  name: 'bag',
  aliases: [ 'b' ],
  run: async ({ message }: { message: Message }) =>
  {
    if(! message.guild)
      return;

    message.channel.startTyping();

    const inventory = await getUserItems({
      userIdentifier: message.author.id,
      discordGuildID: message.guild.id,
    });

    let totalAmount = 0;
    let totalCost = 0;
    const inventoryTableData = [];
    for(const { name, amount, price } of inventory)
    {
      totalAmount += amount;
      totalCost += amount * price;
      inventoryTableData.push([
        name.length >= 20 ? `${name.substr(0, 19)}…` : name,
        amount,
        amount * price,
      ]);
    }

    const tableData =
    [
      [ 'Item', 'Amount', 'Cost' ],
      ...inventoryTableData,
      [ 'Total', totalAmount, totalCost ],
    ];

    const bag = '```ml\n'
      + table(tableData,{
          border:
          {
            topBody: `─`,
            topJoin: `┬`,
            topLeft: `┌`,
            topRight: `┐`,

            bottomBody: `─`,
            bottomJoin: `┴`,
            bottomLeft: `└`,
            bottomRight: `┘`,

            bodyLeft: `│`,
            bodyRight: `│`,
            bodyJoin: `│`,

            joinBody: `─`,
            joinLeft: `├`,
            joinRight: `┤`,
            joinJoin: `┼`
          },
          drawHorizontalLine: (index, size) => (
            index === 0
            || index === 1
            || index === size - 1
            || index === size
          ),
        })
      + '\n```';

    message.channel.send(bag);
    message.channel.stopTyping(true);
  },
};
