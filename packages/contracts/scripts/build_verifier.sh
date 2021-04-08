#!/bin/bash -ex
#
# semaphorejs - Zero-knowledge signaling on Ethereum
# Copyright (C) 2019 Kobi Gurkan <kobigurk@gmail.com>
#
# This file is part of semaphorejs.
#
# semaphorejs is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# semaphorejs is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with semaphorejs.  If not, see <http://www.gnu.org/licenses/>.
#


if [ ! -f ./cache/verifier.sol ]; then
    npx snarkjs generateverifier --vk ./cache/verification_key.json -v ../cache/verifier.sol
fi
