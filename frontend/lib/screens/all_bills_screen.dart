import 'package:flutter/material.dart';

class AllBillsScreen extends StatelessWidget {
  final List<Map<String, dynamic>> transactions = [
    {
      'date': 'May 24th',
      'items': [
        {'name': 'Sushi AI', 'amount': 15.99, 'to': 'Dijkstra', 'from': null},
      ],
    },
    {
      'date': 'May 19th',
      'items': [
        {'name': 'Airbnb', 'amount': 300.00, 'to': null, 'from': 'travel to Chicago'},
        {'name': 'Hotpot', 'amount': 60.59, 'to': 'Bob', 'from': null},
        {'name': 'Uber', 'amount': 10.78, 'to': 'Dijkstra', 'from': null},
      ],
    },
    {
      'date': 'May 12th',
      'items': [
        {'name': 'Costco', 'amount': 20.59, 'to': 'Ash', 'from': null},
        {'name': 'Uber', 'amount': 13.78, 'to': 'A Great Group', 'from': null},
        {'name': 'Rent', 'amount': 850.00, 'to': null, 'from': '6039 Mcpherson'},
      ],
    },
    {
      'date': 'May 7th',
      'items': [
        {'name': 'Parking', 'amount': 10.00, 'to': 'Bob', 'from': null},
        {'name': 'United Provision', 'amount': 17.78, 'to': null, 'from': 'A Great Group'},
        {'name': 'Chilispot', 'amount': 150.00, 'to': 'Dijkstra', 'from': null},
      ],
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('All Bills'),
      ),
      body: ListView.builder(
        itemCount: transactions.length,
        itemBuilder: (context, index) {
          final transaction = transactions[index];
          return Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  transaction['date'],
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                ...transaction['items'].map<Widget>((item) {
                  return Card(
                    child: ListTile(
                      title: Text('${item['name']} - \$${item['amount']}'),
                      subtitle: item['to'] != null
                          ? Text('to ${item['to']}')
                          : item['from'] != null
                              ? Text('from ${item['from']}')
                              : null,
                    ),
                  );
                }).toList(),
              ],
            ),
          );
        },
      ),
    );
  }
}
