"""
    Copyright 2015 Matthew D. Ball (M4Numbers)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
"""

__author__ = 'Matthew Ball'


import requests
import xmltodict

from walkers.WalkerExceptions import WalkerException


class SteamCrawler:

    """
        This is a core class for accessing the Steam Web API (and the legacy leaderboard
        system that is still in use)

        Welcome to the SteamCrawler core build. This crawler has taken a slightly different
        path from that of other APIs in this repository in the interests of messing about
        and having a bit of fun. Instead of having direct functions that get specific items
        in this API, I have built a core crawler which a user is able to plug specific
        interfaces into (which Steam provides).

        Therefore, this is an extremely abstract API that leaves a lot of the work on checking
        permissions up to the user. However, there is probably going to be an extension to
        this that adds in specifics a bit later. It operates either with, or without an API
        key, and an invalid API key will render a lot of the code useless. If your API key is
        a load of arse, consider updating the key to '' so you get a lot of the basic
        functionality that Steam offers anyway.

        Attributes:
            __apiKey: An optional string variable which a user may require if they wish to
                access a protected part of the SteamAPI (such as the ability to fetch profile
                summaries
            __auth: This is a (half) hardcoded version of __base, however it has the location
                of the interface lookup permanently locked in so that whenever the api key
                changes, we don't have to re-generate it in order to perform another lookup
            __base: This is the location of the base Steam Web API that the rest of the class
                will use in order to access the data requested by any users who access the api,
                and it allows for us to plug and unplug the various interfaces, methods, and
                versions available to the user in order to fulfill our needs
            __interfaces: A dictionary of possible interfaces that the user who is using this
                API can access at any one time. This can be influenced by the inclusion or
                exclusion of the above apiKey
            __leaderboard: A slightly more legacy version of the Steam API that we need in
                order to access a number of leaderboards that are hosted by Steam
            headers: A solid set of headers that will accompany any HTML request we make to
                the Steam Web API. At the moment, this consists of our self-defined user-agent
    """

    __base = 'https://api.steampowered.com/{0}/{1}/v{2:04d}/'
    __auth = __base.format('ISteamWebAPIUtil', 'GetSupportedAPIList', 1)
    __leaderboard = 'https://steamcommunity.com/stats/{0}/leaderboards/{1}/'

    def __init__(self, apiKey=''):
        """Initialisation function

        Initialisation for this is a relatively painless affair from the point
        of view for the user. All they need to provide is an api key if they're
        choosing to use one. The addition of an api key will (in general) give
        the user access to more interfaces than they'd have without one.

        Insofar as what actually happens in initialisation, we build ourselves
        a dictionary of all the interfaces, methods, and the versions of which
        a user has access to with/without the provided api key. Think of the
        initialisation as one huge big dictionary constructor for ourselves

        Args:
            apiKey: An optional string which contains a (Steam-generated) API key
                that allows a user access to some protected features on Steam

        Raises:
            None.
        """

        self.headers = {"User-Agent": "other:walkers:v0.0.1 (by /u/M477h3w1012)"}
        self.__apiKey = apiKey
        self.__buildInterfaces()

    def __buildInterfaces(self):
        """Builds the collection of available interfaces for the current api key

        In order for most of this API to work, we require a dictionary of
        the interfaces that the current apiKey has access to. Thankfully,
        Steam provides an interface for that (ten points if you can spot
        a recurring theme in this API before the next recurrence).

        All we do at this point is ping it (with the api key if we've been
        provided one) and take down the dictionary of all the interfaces
        and associated methods that we have access to (and rejig them a bit
        so we can access them easier in a programmatic sense)

        Args:
            None.

        Raises:
            None.
        """

        params = {}
        if self.__apiKey != '':
            params['key'] = self.__apiKey

        self.__interfaces = {}
        t_map = requests.get(self.__auth, headers=self.headers, params=params).json()['apilist']['interfaces']

        # Rejig the dictionary so that we're working with names |-> data instead
        # of numbers |-> data, merging various parts together so that we're left
        # with a complete dictionary in the style of:
        #
        # Interface |-> Method |-> Version |-> Method data

        for interface in t_map:
            mtemp, temp, t, m = ({},) * 4
            for method in interface['methods']:
                t[method['version']] = method
                temp.update(t)
                m[method['name']] = temp
                mtemp.update(m)
            self.__interfaces[interface['name']] = mtemp

    def __generateRequest(self, interface, method, version, parameters):
        """Generates a request fired at the Steam Web API

        This is our central core upon which the whole API hinges. This core
        deals with getting the data that the other functions request, and only
        does so once all of the data we've been provided with has been checked
        against what the user has access to in our list of interfaces

        Args:
            interface: A string with the name of the interface the user would
                like to access
            method: A string with the name of the method that the user would
                like to access
            version: An integer with the version number of the interface/method
                pair that the user would like to access
            parameters: A dictionary of all the parameters that the request will
                need (as generated and checked in our interface dictionary)

        Returns: The data for which the user has requested. By default, we
            return the json interpretation of the content, however, if a
            different format was explicitly requested, the content is returned
            unmolested and we let the user sort it out on their own

        Raises:
            None.
        """

        ret = requests.get(
            self.__base.format(
                interface, method, version,
            ), headers=self.headers, params=parameters
        )

        if 'format' in parameters:
            if parameters['format'] == 'json':
                return ret.json()
            else:
                return ret.content

        return ret.json()

    def updateApiKey(self, apiKey):
        """Update the internal api key (and interface dict)

        Occasionally, someone is going to want to update their api key (maybe if
        they want to switch out permission levels for whatever reason), and this
        requires a few things to change.

        We need to obviously update the internal api key that we keep on hand,
        but we also need to re-build the interface list for the user so that we
        don't accidentally fire off a request for something that they no-longer
        have access to.

        Args:
            apiKey: A string containing the new api key that we're adding to the
                API instead of the last one

        Raises:
            None.
        """

        self.__apiKey = apiKey
        self.__buildInterfaces()

    def checkAccess(self, interface, method, version):
        """Check whether a user has access to the requested location

        Since, with how this API is laid out, a user can feasibly request any
        interface they like, we have to have some form of checking. This function
        asks whether the listed interface, method, and version is present in the
        interface dictionary that we generated earlier

        Args:
            interface: A string containing the name of the interface that the user
                is requesting access to
            method: A string containing the name of the method that the user is
                requesting access to
            version: An integer containing the version for the method/interface pair
                that they are requesting access to

        Returns:
            A boolean value based on whether the user can access the listed interface,
            method, and version that they have requested. If they can, we return True,
            otherwise, False.

        Raises:
            None.
        """

        return \
            interface in self.__interfaces and \
            method in self.__interfaces[interface] and \
            version in self.__interfaces[interface][method]

    def requiresKey(self, interface, method, version):
        """Checks whether a requested method requires the use of the api key

        Some parts of the Steam API are protected by the need to have an API key.
        Whenever a call for a method comes, we need to make sure that, should this
        actually be true, we provide a key for the API to look at. This function
        does that, looking at the parameter list for the requested method, and
        telling the caller whether or not they need to add one in.

        Args:
            interface: A string containing the name of the interface we're checking
            method: A string containing the name of the method we're checking
            version: An integer containing the version number of the method/interface
                pair that we're checking

        Returns:
            A boolean value based on whether the parameter list in our interface
            dictionary includes a request for the api key. If the list contains
            such a parameter, we return True, otherwise, we return False

        Raises:
            None.
        """

        for param in self.__interfaces[interface][method][version]['parameters']:
            if param['name'] == 'key':
                return True
        return False

    def checkParameterSet(self, interface, method, version, parameters, err={}):
        """Check that all non-optional parameter requirements have been met

        Before we send a call through to Steam, we need to make sure that we
        have compiled all non-optional parameters required for the method to
        work, otherwise, Steam is just going to complain at us.

        It doesn't really matter as much when it comes to including parameters
        which aren't in the listing as Steam will just ignore them and we can
        get on with our lives.

        Args:
            interface: A string containing the name of the interface we're checking
            method: A string containing the name of the method we're checking
            version: An integer containing the version of the interface/method pair
                we're checking
            parameters: A dictionary containing the key |-> value pairs of parameters
                that we're checking currently
            err: A dictionary that (theoretically) we're assigning by reference. It
                should always be an empty dictionary.

        Returns:
            A boolean value based on whether there were any missing parameters in the
            given dictionary. If there were no required parameters missing, we return
            True, and if there were, we return False.

        Raises:
            None.
        """

        for param in self.__interfaces[interface][method][version]['parameters']:
            if not param['optional']:
                if not param['name'] in parameters:
                    err[param['name']] = '({0}): {1}'.format(param['type'], param['description'])

        return len(err) == 0

    def accessSteam(self, interface, method, version, parameters):
        """Request some data from Steam

        This is the user-facing function that will allow users to access the Steam
        API with the help of the other functions around here. This function provides
        the checking for the data that the user provides, and, if it finds that the
        data provided is satisfactory, will pass a request up the chain of command
        so the user gets their data.

        Args:
            interface: A string containing the name of the interface that a user is
                requesting access to
            method: A string containing the name of the method within the interface
                that a user is requesting access to
            version: An integer containing the version number of the interface/method
                pair that a user is requesting access to
            parameters: A dictionary of all the parameters that the user is providing
                to access the above interface/method/version tuple

        Returns:
            Returns the requested data in either json format (default), or whatever
            valid format the user requested... by which I mean json or raw content.

        Raises:
            PermissionError: This exception is raised if the user did not have the
                permissions necessary to access the requested interface/method/version
                tuple
            WalkerException: This exception is raised if the user did not provide all
                the non-optional parameters that were required for the method
        """

        err = {}

        if self.checkAccess(interface, method, version):

            # Even if the user provides their own key in the parameter dictionary,
            # we override it with the provided one because otherwise it becomes
            # a bit of a mess, and we need to standardise stuff properly.

            if self.requiresKey(interface, method, version):
                parameters['key'] = self.__apiKey

            if self.checkParameterSet(interface, method, version, parameters, err):
                return self.__generateRequest(interface, method, version, parameters)
            else:
                err_list = []

                for err_key, err_val in err.items():
                    err_list.append(err_key + ' ' + err_val)

                print('\t{0}'.format('\n\t'.join(err_list)))

                raise WalkerException(
                    'Non-Optional Parameter(s) Missing!'
                )

        else:
            raise PermissionError("The interface and method combo you were trying to access"
                                  " either didn't exist, or wasn't accessible to you"
                                  )

    def getAvailableMethods(self):
        """Return a dictionary of all available interface/method/version tuples

        The reason we have a getter for this but not a setter is due to slightly
        defensive programming in that we don't want to allow the user to change
        the values in the interfaces, otherwise, we could end up in a situation
        where the user has changed the interface so that we end up firing off a
        request to Steam for an interface that the user doesn't have the
        permissions to access.

        Args:
            None.

        Returns:
            An immutable copy of the interface dictionary that we've got stored
            in here which, for a reminder, is stored as such:

            Interface |-> Method |-> Version |-> Method Data

            (i.e. ISteamUser |-> GetFriendList |-> 1 |-> {...})

        Raises:
            None.
        """

        return self.__interfaces.copy()

    def getMainLeaderboard(self, gameId):
        """Get all available leaderboards for an app

        This is pretty much the only item of legacy Steam API access that we need in
        order to achieve more-or-less complete functionality. This function gets the
        main leaderboard listings for an individual game and returns them to the
        calling user, who can then choose to look further in should they see fit with
        the Individual function below.

        Args:
            gameId: An Integer ID of a game whose leaderboards the user is requesting

        Returns:
            This returns a dictionary of all the leaderboards that were available
            for the given game ID. The leaderboards in this dictionary are all
            scant overarching things, and more information can be found out by
            using this in tandem with the function getIndividualLeaderboard
        """

        res = requests.get(self.__leaderboard.format(gameId, ""), headers=self.headers, params={'xml': 1})
        return xmltodict.parse(res.content)

    def getIndividualLeaderboard(self, gameId, indId, params):
        """Get an individual leaderboard from a game

        The Main leaderboards returned above are very light on the information, a
        solution for which can be found here. This function returns an individual
        leaderboard (the ids for which are listed in the main leaderboard), which
        features an in-depth list of just who entered and what they scored.

        Args:
            gameId: An integer ID of the application whose leaderboards we're
                poking through with a magnifying glass
            indId: An integer which represents the ID of the individual leaderboard
                that the user is looking up
            params: This dictionary defines any additional parameters that a user
                would like fulfilled when carrying out this request (such as start
                location, end location, and count)

        Returns:
            This function returns a dictionary of all the entries for an individual
            leaderboard.
        """

        params['xml'] = 1
        res = requests.get(self.__leaderboard.format(gameId, indId), headers=self.headers, params=params)
        return xmltodict.parse(res.content)
