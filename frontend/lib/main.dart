import 'package:flutter/material.dart';
import 'package:frontend/screens/login.dart';
import 'screens/home.dart';
import 'screens/groups.dart';
import 'screens/scan.dart';
import 'screens/notification.dart';
import 'screens/profile.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'package:flutter_svg/flutter_svg.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const Split());
}

class Split extends StatelessWidget {
  const Split({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Bottom Navigation',
      theme: ThemeData(
        // 整体theme的参数
        primarySwatch: Colors.grey,
        brightness: Brightness.light,
        scaffoldBackgroundColor: Colors.white,
        appBarTheme: const AppBarTheme(
          color: Colors.white,
          iconTheme: IconThemeData(color: Colors.black),
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          // 底部导航栏的theme参数
          backgroundColor: Colors.white,
          selectedItemColor: Colors.black,
          unselectedItemColor: Colors.grey,
        ),
      ),
      home: MainScreen(), // 主屏幕
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});
  // 主屏幕， stateful widget， 用于切换不同的屏幕
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  // 渲染主屏幕的state
  int _selectedIndex = 0;
  static final List<Widget> _widgetOptions = <Widget>[
    //主屏幕的所有页面
    GoogleButton(), //主屏幕的所有页面
    HomeScreen(),
    GroupScreen(),
    ScanScreen(),
    NotificationScreen(),
    ProfileScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _widgetOptions.elementAt(_selectedIndex),
      bottomNavigationBar: BottomNavigationBar(
        items: <BottomNavigationBarItem>[
          _buildBottomNavigationBarSvgItem('assets/icons/home.svg', 'Home', 0),
          _buildBottomNavigationBarItem(Icons.group, 'Groups', 1),
          _buildBottomNavigationBarSvgItem('assets/icons/scan.svg', 'Scan', 2),
          _buildBottomNavigationBarItem(
              Icons.notifications, 'Notifications', 3),
          _buildBottomNavigationBarItem(Icons.person, 'Profile', 4),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.black,
        unselectedItemColor: Colors.grey,
        onTap: _onItemTapped,
        backgroundColor: Colors.white,
        type: BottomNavigationBarType.fixed,
        showSelectedLabels: false,
        showUnselectedLabels: false,
      ),
    );
  }

  BottomNavigationBarItem _buildBottomNavigationBarItem(
      IconData icon, String label, int index) {
    bool isSelected = _selectedIndex == index;
    return BottomNavigationBarItem(
      icon: Container(
        decoration: BoxDecoration(
          color: isSelected ? Colors.grey[300] : Colors.transparent,
          borderRadius: BorderRadius.circular(8.0),
        ),
        padding: const EdgeInsets.all(8.0),
        child: Icon(
          icon,
          color: isSelected ? Colors.black : Colors.grey,
        ),
      ),
      label: label,
    );
  }

  BottomNavigationBarItem _buildBottomNavigationBarSvgItem(
      String assetName, String label, int index) {
    return BottomNavigationBarItem(
      icon: SvgPicture.asset(
        assetName,
        width: 24,
        height: 24,
        color: _selectedIndex == index ? Colors.black : Colors.grey,
      ),
      label: label,
    );
  }
}
