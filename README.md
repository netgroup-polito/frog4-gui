# FROGv4 GUI

This software module provides a way to control any FROGv4 domain orchestrator.

Its main features are:
* Create a network service (often called **service graphs**), starting from elementary building blocks (network functions, links).
* View and modify existing services, either stored in the datastore (hence, not yet deployed) or already deployed in the controlled domain;
* Load and save the service description to an external file;
* Interact with each network function and change its configuration
* Manage users and group of the attached domain.

A service graph is the composition of different elementary elements (called **network functions**), such as a DHCP server operating on a (virtual) LAN, with a firewall and a NAT operating on the link connecting to the Internet as depicted in the example below.

                    +------+
      +--------+    | DHCP |
      |  user  |    +------+
      +--------+        |      +----------+   +-----+
     / laptop /---o-----+------| Firewall |---| NAT |---o-- Internet
    +--------+                 +----------+   +-----+
                  |                                     |
                  |<--------- service graph ----------->|


In addition, this GUI allows to view how a service graph is being transformed by the different orchestration components (e.g., in case of hierarchical orchestrators). Of course, this requires that multiple instances of this GUI are installed, one associated to each domain.

The GUI supports two operating modes, one targeting normal users (called '_simplified view_'), the other expert users ('_full view_'). The former uses a simplistic model in which network functions can only be cascaded, while the network traffic traverses one after the other. The latter is a more powerful model in which network functions can be organized in an arbitrary topology, even allowing traffic to be split across different functions based on traffic characteristics (e.g., the web traffic is sent to a stateful firewall, while the rest is sent to a traditional stateless firewall).
