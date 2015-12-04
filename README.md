# Virtualized Network Services GUI

This software module provides a way to _create_, _modify_ and _view_ complex virtualized network services, often called **service graphs**. 
A complex virtualized network service is usually made through the composition different elementary elements, such as a DHCP server operating on a (virtual) LAN, with a firewall and a NAT operating on the link connecting to the Internet as depicted in the example below.

                    +------+
      +--------+    | DHCP |
      |  user  |    +------+
      +--------+        |      +----------+   +-----+
     / laptop /---o-----+------| Firewall |---| NAT |---o-- Internet
    +--------+                 +----------+   +-----+
                  |                                     |
                  |<--------- service graph ----------->|

This GUI allows users to:
* Create their own network service, starting from elementary building blocks (network functions, links).
* View and modify their own service.
* Load and save the service description to an external file.
* View how the service is being transformed by the different orchestration components, in order to facilitate the debug of those software component (available for the administrator only).

The GUI supports two operating modes, one targeting normal users (called '_simplified view_'), the other expert users ('_full view_'). The former uses a simplistic model in which network functions can only be cascaded, while the network traffic traverses one after the other. The latter is a more powerful model in which network functions can be organized in an arbitrary topology, even allowing traffic to be split across different functions based on traffic characteristics (e.g., the web traffic is sent to a stateful firewall, while the rest is sent to a traditional stateless firewall).

In addition, the GUI allows specifying whether a given service graph can be modified  or it is available in read-only mode. The latter is useful for debugging purposes and it can be used to show how the requested service is translated by the orchestrator before being instantiated by the actual infrastructure domain(s). 
